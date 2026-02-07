import Queue from 'bull';

export const emailQueue = new Queue('email-notifications', {
	redis: {
		host: process.env.REDIS_HOST || '127.0.0.1',
		port: parseInt(process.env.REDIS_PORT || '6379')
	}
});

emailQueue.process(async (job) => {
	const { to, submissionId, formTitle } = job.data;

	console.log(`[📧 Email Worker] Preparing confirmation for ${to} (Submission #${submissionId})`);

	await new Promise((resolve) => setTimeout(resolve, 1000));

	console.log(`[✅ Email Sent] Sent mail to user ${to} for form: "${formTitle}"`);
});
