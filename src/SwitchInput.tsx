import { Tooltip, Icon, FormGroup, FormControlLabel, Switch } from "@mui/material"
import Grid from "@mui/material/Grid2";
import HelpIcon from '@mui/icons-material/Help';
import { useState } from "react";

interface DataInputProps {
    label: string,
    tooltip: string,
    handleInput: (a: any) => void,
    defaultState: boolean,
    onValue?: any,
    offValue?: any
}

export default function SwitchInput({ label, tooltip, handleInput, onValue, offValue, defaultState }: DataInputProps) {

    const [checked, setChecked] = useState(defaultState)

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
                                    handleInput(event.target.checked ? onValue : offValue)
                                }} />}
                            label={label}
                            labelPlacement="end" />
                    </FormGroup>
                </Grid>
                <Grid size={2} container justifyContent={'flex-end'}>
                    <Tooltip title={tooltip} enterTouchDelay={0} leaveTouchDelay={3000}>
                        <Icon>
                            <HelpIcon color="action" />
                        </Icon>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid>
    )
}