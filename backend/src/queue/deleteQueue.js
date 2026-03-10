const deleteQueue = [];
const processingJobs = new Map();
const completedJobs = [];

const PROCESSING_DELAY_MS = 1500;

function addDeleteJob(taskId) {
  const job = {
    id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    taskId,
    status: "waiting",
    createdAt: new Date().toISOString(),
    processedAt: null,
    completedAt: null,
  };

  deleteQueue.push(job);
  console.log(`[Queue] Job ${job.id} added for task ${taskId}`);

  processNextJob(job.id);

  return job;
}

function processNextJob(jobId) {
  const jobIndex = deleteQueue.findIndex((j) => j.id === jobId);
  if (jobIndex === -1) return;

  const job = deleteQueue[jobIndex];
  job.status = "active";
  job.processedAt = new Date().toISOString();
  processingJobs.set(job.id, job);

  console.log(`[Queue] Processing job ${job.id}...`);

  setTimeout(() => {
    job.status = "completed";
    job.completedAt = new Date().toISOString();
    processingJobs.delete(job.id);
    completedJobs.push(job);
    deleteQueue.splice(jobIndex, 1);
    console.log(`[Queue] Job ${job.id} completed`);
  }, PROCESSING_DELAY_MS);
}

function getQueueStats() {
  return {
    waiting: deleteQueue.filter((j) => j.status === "waiting").length,
    active: deleteQueue.filter((j) => j.status === "active").length,
    completed: completedJobs.length,
    jobs: [...deleteQueue, ...completedJobs.slice(-10)],
  };
}

function hasPendingDeleteJob(taskId) {
  return deleteQueue.some((j) => j.taskId === taskId);
}

module.exports = { addDeleteJob, getQueueStats, hasPendingDeleteJob };