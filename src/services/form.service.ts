import AppDataSource from '../data-source';
import { Form } from '../models/form.model';
import { FormVersion } from '../models/form-version.model';
import { FormSchema } from '../types/form.types';
import { Repository } from 'typeorm';
import { Conflict, ResourceNotFound } from '../middleware';

export class FormService {
	private formRepo: Repository<Form>;
	private versionRepo: Repository<FormVersion>;

	constructor() {
		this.formRepo = AppDataSource.getRepository(Form);
		this.versionRepo = AppDataSource.getRepository(FormVersion);
	}

	async createForm(title: string, slug: string, description?: string) {
		const formExists = await this.formRepo.findOne({
			where: { slug }
		});
		if (formExists) {
			throw new Conflict('Form of the same slug exists');
		}
		const form = this.formRepo.create({ title, slug, description });
		return await this.formRepo.save(form);
	}

	async addVersion(formId: string, schema: FormSchema) {
		const addTransaction = await this.versionRepo.manager.transaction(async (transactionalEntityManager) => {
			const form = await transactionalEntityManager.findOne(Form, {
				where: { id: formId },
				lock: { mode: 'pessimistic_write' }
			});

			if (!form) throw new ResourceNotFound('Form not found');
			const result = await transactionalEntityManager
				.createQueryBuilder(FormVersion, 'version')
				.select('MAX(version.version)', 'max')
				.where('version.form = :formId', { formId })
				.getRawOne();

			const nextVersion = (parseInt(result?.max) || 0) + 1;

			const newVersion = transactionalEntityManager.create(FormVersion, {
				form,
				version: nextVersion,
				schema
			});

			return await transactionalEntityManager.save(newVersion);
		});
		return addTransaction;
	}

	async getLatestVersion(slug: string) {
		const latestVersion = await this.versionRepo
			.createQueryBuilder('version')
			.leftJoin('version.form', 'form')
			.where('form.slug = :slug', { slug })
			.orderBy('version.version', 'DESC')
			.getOne();

		if (!latestVersion) throw new ResourceNotFound('Version not found');

		return latestVersion;
	}
}
