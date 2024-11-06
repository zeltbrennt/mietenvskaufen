import { Tooltip, Icon, FormGroup, FormControlLabel, Switch } from "@mui/material"
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

export default function SwitchInput({ label, tooltip, handleInput }: DataInputProps) {

    const [checked, setChecked] = useState(true)

    return (
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>

            <Grid container spacing={1} alignItems={'center'} >
                <Grid size={10}>

                    <FormGroup>
                        <FormControlLabel
                            control={<Switch
                                checked={checked}
                                onChange={(event) => {
                                    setChecked(event.target.checked)
                                    handleInput(event.target.checked ? 18.46 : 25)
                                }} />}
                            label={label}
                            labelPlacement="end" />
                    </FormGroup>
                </Grid>
                <Grid size={2} container justifyContent={'flex-end'}>
                    <Tooltip title={tooltip}>
                        <Icon>
                            <HelpIcon color="primary" />
                        </Icon>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid>
    )
}