import { Slider, Tooltip, Icon, Typography } from "@mui/material"
import Grid from "@mui/material/Grid2";
import HelpIcon from '@mui/icons-material/Help';

interface DataInputProps {
    label: string,
    tooltip: string,
    handleInput: (a: number) => void,
    typeHint?: string,
    defaultValue?: number
}

export default function SliderInput({ label, tooltip, handleInput, defaultValue }: DataInputProps) {
    return (
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>

            <Grid container spacing={1} alignItems={'center'} >
                <Grid size={12}>
                    <Typography >{label}</Typography>
                </Grid>
                <Grid size={10}>
                    <Slider
                        onChange={(_, newVal) => {
                            handleInput(Number(newVal))
                        }}
                        defaultValue={defaultValue}
                        min={0}
                        max={10}
                        step={0.1}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => { return `${value}%` }}
                        id={label}
                        sx={{ flexGrow: 1 }}
                    />
                </Grid>
                <Grid size={2} container justifyContent={'flex-end'}>

                    <Tooltip title={tooltip}>
                        <Icon>
                            <HelpIcon />
                        </Icon>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid >
    )
}