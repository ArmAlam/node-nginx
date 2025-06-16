import { getChannel } from "./connection";

export const publishTask = (task: any) => {
  const channel = getChannel();

  if (!channel) {
    console.error("Channel not ready");
    return;
  }

  channel.sendToQueue("tasks", Buffer.from(JSON.stringify(task)), {
    persistent: true,
  });
  console.log("Task published:", task);
};
