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

    return (
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>

            <Grid container spacing={1} alignItems={'center'} >
                <Grid size={12}>
                    <Typography >{label}</Typography>
                </Grid>
                <Grid size={{ md: 10, xs: 11 }}>
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
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => { return `${Math.round(100 * value) / 100}%` }}
                        id={label}
                        sx={{ flexGrow: 1 }}
                    />
                </Grid>
                <Grid size={{ md: 2, xs: 1 }} container justifyContent={'flex-end'}>

                    <Tooltip title={tooltip}>
                        <Icon>
                            <HelpIcon color="action" />
                        </Icon>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid >
    )
}