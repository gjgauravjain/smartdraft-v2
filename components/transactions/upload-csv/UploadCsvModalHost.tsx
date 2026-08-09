"use client";

import { useAuth, useStore } from "@/store/useStore";
import UploadCsvModal from "./UploadCsvModal";

const UploadCsvModalHost = () => {
  const { user } = useAuth();
  const uploadCsvTransactionTypeModal = useStore(
    (state) => state.uploadCsvTransactionTypeModal,
  );

  if (!user?.isStaff) return null;
  if (!uploadCsvTransactionTypeModal?.transactionType) return null;

  return (
    <UploadCsvModal uploadCsvTransactionType={uploadCsvTransactionTypeModal} />
  );
};

export default UploadCsvModalHost;
