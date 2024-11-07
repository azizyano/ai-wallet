import { toast } from "react-toastify";

/**
 * Utility function to format the balance to 6 decimal places.
 * This is more accurate than using .toFixed() because it does not round it.
 * 
 * @param {string} balanceInEther - The balance in Ether as a string.
 * @returns {string} The formatted balance with up to 6 decimal places.
 */
export const formatBalance = (balanceInEther: string): string => {
  const [integerPart, decimalPart] = balanceInEther.split(".");
  const truncatedDecimalPart = decimalPart ? decimalPart.slice(0, 5) : "0000";
  return `${integerPart}.${truncatedDecimalPart}`;
};

/**
 * Function to truncate Ethereum addresses for display purposes.
 * 
 * @param {string | undefined} address - The Ethereum address to truncate.
 * @returns {string} The truncated address in the format `0x1234...abcd`, or an empty string if undefined.
 */
export const truncateAddress = (address: string | undefined): string => {
  // Check if the address is defined and matches `0x${string}` format
  if (address && /^0x[a-fA-F0-9]{40}$/.test(address)) {
    return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
  }
  return ''; // Return empty string if address is undefined or doesn't match expected format
};

/**
 * Copies the provided text to the clipboard and shows a toast notification.
 * 
 * @param {string | undefined} text - The Ethereum address or text to copy to the clipboard.
 * @param {string} [message="Copied to clipboard!"] - The message to display in the toast notification.
 */
export const copyToClipboard = (text: string | undefined, message: string = "Copied to clipboard!") => {
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      toast(message, {
        position: "top-left",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
  }
};
