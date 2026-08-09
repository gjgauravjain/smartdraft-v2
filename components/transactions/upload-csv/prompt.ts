import { UploadCsvTransactionType, useStore } from "@/store/useStore";

let pendingQueue: UploadCsvTransactionType[] = [];

export const promptSaveToCsv = (
  ...prompts: Array<UploadCsvTransactionType | null | undefined>
) => {
  const {
    user,
    uploadCsvTransactionTypeModal,
    setUploadCsvTransactionTypeModal,
  } = useStore.getState();

  if (!user?.isStaff) return;

  const nextPrompts = prompts.filter(
    (prompt): prompt is UploadCsvTransactionType =>
      Boolean(prompt?.transactionType),
  );

  if (!nextPrompts.length) return;

  if (uploadCsvTransactionTypeModal) {
    pendingQueue.push(...nextPrompts);
    return;
  }

  const [first, ...rest] = nextPrompts;
  pendingQueue.push(...rest);
  setUploadCsvTransactionTypeModal(first);
};

export const closeUploadCsvPrompt = () => {
  const { setUploadCsvTransactionTypeModal } = useStore.getState();
  const next = pendingQueue.shift() ?? null;
  setUploadCsvTransactionTypeModal(next);
};
