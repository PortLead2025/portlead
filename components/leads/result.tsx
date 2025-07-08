import { useState } from "react";

type ResultProps = { data: Record<string, string | number>[] | null };

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function Result({ data }: ResultProps) {
  const [icon, setIcon] = useState(CopyIcon);

  const copy = async () => {
    await navigator?.clipboard?.writeText(JSON.stringify(data, null, 2));
    setIcon(CheckIcon);
    setTimeout(() => setIcon(CopyIcon), 2000);
  };

  return (
    <>
      {data && (
        <>
          <pre className="text-xs max-md:min-w-50 max-md:w-full font-mono px-3 py-4 rounded border max-h-32 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>

          <p className="text-xs flex items-center gap-2 text-gray-500 mb-2">
            Click the button to copy the JSON data to your clipboard.
            <button
              type="button"
              onClick={copy}
              className="size-10 border transition-colors hover:cursor-pointer hover:bg-gray-100 hover:border-gray-400 hover:text-black rounded-md border-gray-200 flex items-center justify-center"
            >
              {icon}
            </button>
          </p>
        </>
      )}
    </>
  );
}
