import { TextField, Tooltip, Icon, InputAdornment } from "@mui/material"
import Grid from "@mui/material/Grid2";
import HelpIcon from '@mui/icons-material/Help';
import { useState } from "react";
import { parseNumber, formatNumber } from "./util";

interface DataInputProps {
    label: string,
    tooltip: string,
    handleInput: (a: number) => void,
    typeHint?: string,
    defaultValue?: number
}

export default function DataInput({ label, tooltip, handleInput, typeHint, defaultValue }: DataInputProps) {

    const [state, setState] = useState(defaultValue)

    return (
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>

            <Grid container spacing={1} alignItems={'center'} >
                <Grid size={{ md: 10, xs: 11 }}>

                    <TextField
                        onChange={(event) => {
                            const numericValue = parseNumber(event.target.value)
                            handleInput(numericValue)
                            setState(numericValue)
                        }}
                        value={state !== undefined ? formatNumber(state) : ''}
                        label={label}
                        id={label}
                        required
                        fullWidth
                        slotProps={{
                            input: { endAdornment: <InputAdornment position="end">{typeHint}</InputAdornment> }
                        }} />
                </Grid>
                <Grid size={{ md: 2, xs: 1 }} container justifyContent={'flex-end'}>
                    <Tooltip title={tooltip} enterTouchDelay={0} leaveTouchDelay={3000}>
                        <Icon>
                            <HelpIcon color='action' />
                        </Icon>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid>
    )
}