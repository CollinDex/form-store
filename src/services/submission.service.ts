import AppDataSource from '../data-source';
import { Submission } from '../models/submission.model';
import { FormVersion } from '../models/form-version.model';
import { SubmissionAnswers } from '../types/form.types';
import { Repository } from 'typeorm';
import { ResourceNotFound } from '../middleware';
import { AuditLog } from '../models/audit-log.model';
import { emailQueue } from '../queues/email.queue';

export class SubmissionService {
	private submissionRepo: Repository<Submission>;
	private versionRepo: Repository<FormVersion>;
	private auditRepo: Repository<AuditLog>;

	constructor() {
		this.submissionRepo = AppDataSource.getRepository(Submission);
		this.versionRepo = AppDataSource.getRepository(FormVersion);
		this.auditRepo = AppDataSource.getRepository(AuditLog);
	}

	async submitResponse(versionId: string, answers: SubmissionAnswers, userEmail: string) {
		const version = await this.versionRepo.findOne({ where: { id: versionId }, relations: ['form'] });

		if (!version) throw new ResourceNotFound('Form Version not found');

		const submission = this.submissionRepo.create({
			formVersion: version,
			answers
		});

		const savedSubmission = await this.submissionRepo.save(submission);

		this.auditRepo.save({
			action: 'SUBMISSION_CREATED',
			entityId: savedSubmission.id,
			details: { version: version.version }
		});

		emailQueue.add(
			{
				to: userEmail,
				submissionId: savedSubmission.id,
				formTitle: version.form.title,
				timestamp: new Date()
			},
			{
				attempts: 3,
				backoff: 5000
			}
		);

		return savedSubmission;
	}

	async getSubmissions(formId: string) {
		const submissions = await this.submissionRepo.find({
			where: {
				formVersion: {
					form: { id: formId }
				}
			},
			relations: ['formVersion'],
			order: { createdAt: 'DESC' }
		});

		if (!submissions) {
			throw new ResourceNotFound('Invalid FormID');
		}

		return submissions;
	}
}
