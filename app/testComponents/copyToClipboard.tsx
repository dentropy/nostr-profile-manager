import {  Button, Snackbar, Alert } from "@mui/material";
import { useState } from "react";

export const CopyToClipboardButton = ({ textToCopy }) => {
    const [open, setOpen] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setOpen(true);
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <Button
                variant="contained"
                onClick={handleCopy}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
                Copy to Clipboard
            </Button>
            {/* <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Text copied to clipboard!
                </Alert>
            </Snackbar> */}
        </div>
    );
};
