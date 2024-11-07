import { Card, CardContent, Tooltip, Icon, Typography } from "@mui/material"
import Grid from "@mui/material/Grid2";
import HelpIcon from '@mui/icons-material/Help';

interface DataOutputProps {
    label: string,
    tooltip: string,
    value: number,
    typeHint?: string
}

export default function DataOutput({ label, tooltip, value, typeHint }: DataOutputProps) {
    return (
        <Grid size={{ md: 6, xs: 12 }} >
            <Card >
                <CardContent >
                    <Grid container spacing={1} alignItems={'center'} >
                        <Grid size={12}>
                            <Typography >{label}</Typography>
                        </Grid>
                        <Grid size={10}>
                            <Typography variant="button">
                                {typeHint === '€' ? Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value) : Math.ceil(value)}
                            </Typography>
                        </Grid>
                        <Grid size={2} container justifyContent={'flex-end'}>

                            <Tooltip title={tooltip} enterTouchDelay={0} leaveTouchDelay={3000}>
                                <Icon>
                                    <HelpIcon color="action" />
                                </Icon>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}