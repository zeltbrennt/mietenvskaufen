import { Slider, Tooltip, Icon, Typography } from "@mui/material"
import Grid from "@mui/material/Grid2";
import HelpIcon from '@mui/icons-material/Help';
import { useState } from "react";

interface DataInputProps {
    label: string,
    tooltip: string,
    handleInput: (a: number) => void,
    typeHint?: string,
    defaultValue?: number
}

export default function SliderInput({ label, tooltip, handleInput, defaultValue }: DataInputProps) {

    const [state, setState] = useState(defaultValue)

    const formatPercent = (n: number | undefined) => {
        return n ? Intl.NumberFormat('de-DE', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n / 100) : '0.0%'
    }

    return (
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>

            <Grid container spacing={1} alignItems={'center'} >
                <Grid size={12}>
                    <Typography variant="caption">{label}</Typography>
                </Grid>
                <Grid size={3}>
                    <Typography>{formatPercent(state)}</Typography>
                </Grid>
                <Grid size={{ md: 7, xs: 8 }}>
                    <Slider
                        onChange={(_, newVal) => {
                            setState(Number(newVal))
                        }}
                        onChangeCommitted={(_, newVal) => {
                            handleInput(Number(newVal))
                        }}
                        value={state}
                        min={0}
                        max={20}
                        step={0.1}
                        valueLabelDisplay="off"
                        id={label}
                        sx={{ flexGrow: 1 }}
                    ><span>{state}</span></Slider>
                </Grid>
                <Grid size={{ md: 2, xs: 1 }} container justifyContent={'flex-end'}>

                    <Tooltip title={tooltip} enterTouchDelay={0} leaveTouchDelay={3000}>
                        <Icon>
                            <HelpIcon color="action" />
                        </Icon>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid >
    )
}