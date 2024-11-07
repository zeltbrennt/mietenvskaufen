import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField, InputAdornment } from "@mui/material"
import { useState } from "react"
import { parseNumber, formatNumber } from "./util"

interface DonateDialogProps {
    open: boolean,
    onClose: () => void,
}

export default function DonateDialog({ open, onClose }: DonateDialogProps) {

    const [amount, setAmount] = useState<number>()
    const [error, setError] = useState(false)

    return (
        <Dialog open={open} onClose={() => {
            setAmount(undefined)
            onClose()
        }}>
            <DialogTitle>Vielen Dank für deine Spende 🥰</DialogTitle>
            <FormControl>
                <DialogContent>
                    <TextField
                        label='Betrag'
                        error={error}
                        fullWidth
                        value={amount !== undefined ? formatNumber(amount) : ''}
                        onChange={(event) => {
                            const numericValue = parseNumber(event.target.value)
                            setAmount(numericValue)
                            setError(numericValue <= 0)
                        }}
                        slotProps={{
                            input: { endAdornment: <InputAdornment position="end">€</InputAdornment> }
                        }} />
                </DialogContent>
                <DialogActions>

                    <Button type="submit" variant="contained" color="secondary"
                        disabled={error}
                        onClick={() => {
                            onClose()
                            window.open(`https://paypal.me/zeltbrennt/${amount}`)
                        }}>Spenden</Button>
                    <Button onClick={onClose} color='error' >Schließen</Button>
                </DialogActions>
            </FormControl>
        </Dialog >
    )
}