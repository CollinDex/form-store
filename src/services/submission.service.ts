import AppDataSource from '../data-source';
import { Submission } from '../models/submission.model';
import { FormVersion } from '../models/form-version.model';
import { SubmissionAnswers } from '../types/form.types';
import { Repository } from 'typeorm';
import { ResourceNotFound } from '../middleware';

export class SubmissionService {
	private submissionRepo: Repository<Submission>;
	private versionRepo: Repository<FormVersion>;

	constructor() {
		this.submissionRepo = AppDataSource.getRepository(Submission);
		this.versionRepo = AppDataSource.getRepository(FormVersion);
	}

	async submitResponse(versionId: string, answers: SubmissionAnswers) {
		const version = await this.versionRepo.findOne({ where: { id: versionId } });

		if (!version) throw new ResourceNotFound('Form Version not found');

		const submission = this.submissionRepo.create({
			formVersion: version,
			answers
		});

		return await this.submissionRepo.save(submission);
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
