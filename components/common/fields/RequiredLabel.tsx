import React from "react";

const RequiredLabel = ({
  children,
  showRequired = true,
}: {
  children: React.ReactNode;
  showRequired?: boolean;
}) => {
  return (
    <span className="inline-flex items-center gap-[5px]">
      <span>{children}</span>
      {showRequired && (
        <span className="text-xs font-bold text-primary dark:text-dropdown-primary">
          *
        </span>
      )}
    </span>
  );
};

export default RequiredLabel;
