import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { v4 as uuidv4 } from "uuid";
import {
  SQS_ACCESS_KEY_ID,
  SQS_TIO_QUEUE_URL,
  SQS_REGION,
  SQS_SECRET_ACCESS_KEY,
} from "../config/envs";

const sqsClient = new SQSClient({
  credentials: {
    accessKeyId: SQS_ACCESS_KEY_ID,
    secretAccessKey: SQS_SECRET_ACCESS_KEY,
  },
  region: SQS_REGION,
});

const QueueService = {
  /**
   * @param {[String]} ctraderIds
   */
  usersRibbon: async (ctraderIds) => {
    const chunkSize = 10;
    for (let i = 0; i < ctraderIds.length; i += chunkSize) {
      const timestamp = Date.now();
      const chunk = ctraderIds.slice(i, i + chunkSize);
      // do whatever
      const msgCommand = new SendMessageBatchCommand({
        QueueUrl: SQS_TIO_QUEUE_URL,
        Entries: chunk.map((ctraderId) => ({
          Id: uuidv4(),
          MessageGroupId: uuidv4(),
          MessageDeduplicationId: uuidv4(),
          MessageBody: JSON.stringify({
            data: { ctraderId },
            type: "batchRibbon",
            timestamp,
          }),
        })),
      });
      await sqsClient.send(msgCommand);
    }
  },
};

export default QueueService;
