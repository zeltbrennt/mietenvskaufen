import { Box, Link, Button, Card, CardContent, Container, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2';
import DataInput from './DataInput';
import DataOutput from './DataOutput';
import { useEffect, useState } from 'react';
import SliderInput from './SliderInput';
import ResultOutput from './ResultOutput';
import SwitchInput from './SwitchInput';
import DonateDialog from './DonateDialog';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
function App() {

  const [kapitalertragssteuer, setKapitalertrtagssteuer] = useState(18.46)
  const [inflation, setInflation] = useState(2)
  const [mietteuerung, setMietteuerung] = useState(2)
  const [wersteigerung, setWertsteigerung] = useState(3)
  const [rendite, setRendite] = useState(6)
  const [eigenkapital, setEigenkapital] = useState(100000)
  const [kaltmiete, setKaltmiete] = useState(1100)
  const [kaufpreis, setKaufpreis] = useState(350000)
  const [modernKost, setModernKost] = useState(70000)
  const [gest, setGest] = useState(6.5)
  const [notar, setNotar] = useState(2)
  const [makler, setMakler] = useState(4)
  const [zinsenJahr, setZinsenJahr] = useState(3.5)
  const [tilgung, setTilgung] = useState(2)
  const [instand, setInstand] = useState(1.5)

  const [darlehen, setDarlehen] = useState(0)
  const [zinsenMonat, setZinsenMonat] = useState(0)
  const [annuitaet, setAnnuitaet] = useState(0)
  const [monatBelastung, setMonatBelastung] = useState(0)
  const [abzahlenMonat, setAbzahlenMonat] = useState(0)
  const [abzahlenJahr, setAbzahlenJahr] = useState(0)
  const [gesamtBelastung, setGesamtBelastung] = useState(0)
  const [wertImmobilie, setWertImmobilie] = useState(0)

  const [mietpreis, setMietpreis] = useState(0)
  const [instantEuro, setInstantEuro] = useState(0)
  const [sparrate, setSparrate] = useState(0)
  const [vermoegen, setVermoegen] = useState(0)
  const [vermoegenNetto, setVermoegenNetto] = useState(0)

  const [tilgungsplan, setTilgungsplan] = useState<tilgungsplanRow[]>([])
  const [showTilgungsplan, setShowTilgungsplan] = useState(false)
  const [sparManuell, setSparManuell] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const _totalAmnt = kaufpreis + modernKost
    const _darlehen = Math.max(_totalAmnt + (kaufpreis / 100) * gest + (kaufpreis / 100) * notar + (kaufpreis / 100) * makler - eigenkapital, 0)
    const _zinsenMonat = zinsenJahr / 100 / 12 * _darlehen
    const _annuitaet = tilgung / 100 / 12 * _darlehen + _zinsenMonat
    let _rate = (zinsenJahr / 100 / 12)
    const _den = -_darlehen * _rate + _annuitaet
    const _abzahlenMonat = _darlehen === 0 ? 0 : _rate === 0 ? _darlehen / _annuitaet : Math.log(_annuitaet / _den) / Math.log(1 + _rate);
    const _abzahlenJahr = _abzahlenMonat / 12;
    const _mietpreis = _abzahlenJahr === Infinity ? mietteuerung > 0 ? Infinity : kaltmiete : ((kaltmiete * (1 + mietteuerung / 100) ** _abzahlenJahr) + kaltmiete) / 2;
    _rate = instand / 100 / 12
    const _instandEuro = _abzahlenJahr !== Infinity ? (((_totalAmnt * _rate) * (1 + inflation / 100) ** _abzahlenJahr) + _totalAmnt * _rate) / 2 : Infinity
    const _monatBelastung = _abzahlenJahr !== Infinity ? annuitaet + instantEuro : Infinity
    const _sparrate = sparManuell ? sparrate : _abzahlenJahr === Infinity ? Infinity : _abzahlenJahr === 0 ? 0 : _monatBelastung - _mietpreis;
    const _pmt = -_sparrate * 12
    _rate = rendite / 100
    const _pow = (1 + _rate) ** _abzahlenJahr
    const _vermoegen = (_rate === 0) ? eigenkapital : (_pmt * (1 - _pow) / _rate) + eigenkapital * _pow;
    const _vermoegenNetto = (_rate === 0) ? eigenkapital : (_abzahlenJahr === Infinity) ? Infinity : _vermoegen - ((_vermoegen - (_sparrate * 12 * _abzahlenJahr)) * kapitalertragssteuer / 100);
    const _gesamtBelastung = _monatBelastung * 12 * _abzahlenJahr + eigenkapital > (_totalAmnt) ? _totalAmnt : eigenkapital;
    const _wertImmobilie = _abzahlenJahr !== Infinity ? _totalAmnt * (1 + wersteigerung / 100) ** _abzahlenJahr : Infinity
    setDarlehen(_darlehen)
    setZinsenMonat(_zinsenMonat)
    setAnnuitaet(_annuitaet)
    setAbzahlenMonat(_abzahlenMonat)
    setAbzahlenJahr(_abzahlenJahr)
    setMietpreis(_mietpreis)
    setInstantEuro(_instandEuro)
    setMonatBelastung(_monatBelastung)
    setSparrate(_sparrate)
    setVermoegen(_vermoegen)
    setVermoegenNetto(_vermoegenNetto)
    setGesamtBelastung(_gesamtBelastung)
    setWertImmobilie(_wertImmobilie)
    setShowTilgungsplan(false)

  }, [inflation, mietteuerung, wersteigerung, rendite, kapitalertragssteuer, mietpreis, eigenkapital, kaufpreis, modernKost,
    gest, notar, makler, zinsenJahr, tilgung, instand, sparManuell, sparrate])


  interface tilgungsplanRow {
    rate: number,
    annuity: number,
    zins: number,
    tilgung: number,
    rest: number
  }

  const createTilgungsplan = () => {
    const plan: tilgungsplanRow[] = []
    if (abzahlenMonat === Infinity) {
      setTilgungsplan(plan)
      return
    }
    let rest = darlehen
    let z = zinsenJahr / 100 / 12 * rest
    let a = Math.min(annuitaet, rest + z)
    let t = a - z
    for (let i = 0; i < abzahlenMonat; i++) {
      z = zinsenJahr / 100 / 12 * rest
      a = Math.min(annuitaet, rest + z)
      t = a - z
      rest -= t
      plan.push({
        rate: i,
        annuity: a,
        zins: z,
        tilgung: t,
        rest: rest
      })
    }
    setTilgungsplan(plan)
  }


  return (
    <Container maxWidth='md'
      sx={{
        bgcolor: 'Window',
        borderRadius: '5px',
        paddingTop: 2,
        paddingBottom: 1,
        marginLeft: { xs: 0, md: 'auto' },
        marginRight: { xs: 0, md: 'auto' }
      }} >
      <Typography variant='h3' marginBottom={1} >Mieten vs. Kaufen</Typography>
      <Typography marginBottom={1}>
        Inspiriert durch <Link sx={{ color: 'lightskyblue' }} href={"https://www.reddit.com/r/Finanzen/comments/1gjabd5/ich_pr%C3%A4sentiere_meinen_mieten_vs_kaufen_rechner/"} >diesen Post</Link> auf Reddit von <Link sx={{ color: 'lightskyblue' }} href={"https://www.reddit.com/user/nothingtohidemic"}>/u/nothingtohidemic</Link>
      </Typography>
      <Card sx={{ marginBottom: 5, bgcolor: 'whitesmoke' }}>
        <CardContent>
          <Typography variant='h4'>Annahmen</Typography>
          <Divider sx={{ marginBottom: 2 }}></Divider>
          <Grid container spacing={1.5} alignItems={"flex-end"}>
            <SliderInput
              label='Inflation'
              tooltip='Bitte angenommene durchschnittliche Inflation eintragen'
              defaultValue={inflation}
              handleInput={setInflation}
            />
            <SliderInput
              label='Mietteuerungsrate'
              tooltip='Bitte angenommene durchschnittliche Mieterhöhung (kalt) pro Jahr eintragen'
              defaultValue={mietteuerung}
              handleInput={setMietteuerung} />
            <SliderInput
              label='Durchschnittliche Wertsteigerung Immobilie'
              tooltip='Bitte angenommene durchschnittliche Wertsteigerung der Immobilie pro Jahr eintragen'
              defaultValue={wersteigerung}
              handleInput={setWertsteigerung} />
            <SliderInput
              label='Durchschnittliche Rendite Invest'
              tooltip='Bitte angenommene durchschnittliche Rendite für Investitionen pro Jahr eintragen'
              defaultValue={rendite}
              handleInput={setRendite} />
            <SwitchInput
              label='Ausschließlich Aktien-ETF'
              tooltip='Kapitalertragssteuer liegt bei 26.375%, bei Aktien-ETFs jedoch nur 18.463%'
              onValue={18.463}
              offValue={26.375}
              defaultState={true}
              handleInput={setKapitalertrtagssteuer} />
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ marginBottom: 5, bgcolor: 'whitesmoke' }}>
        <CardContent>
          <Typography variant='h4'>Eckdaten</Typography>
          <Divider sx={{ marginBottom: 2 }}></Divider>
          <Grid container spacing={1.5} alignItems={"flex-end"}>
            <DataInput
              label='Mietpreis kalt (heute)'
              tooltip='Bitte hier die Kaltmiete eintragen'
              typeHint='€'
              defaultValue={kaltmiete}
              handleInput={setKaltmiete} />
            <DataInput
              label='Eigenkapital'
              tooltip='Bitte jetzt verfügbares Eigenkapital eintragen'
              typeHint='€'
              defaultValue={eigenkapital}
              handleInput={setEigenkapital} />

            <DataInput
              label='Kaufpreis Immobilie'
              tooltip='Bitte hier den Kaufpreis der Immobilie eintragen'
              typeHint='€'
              defaultValue={kaufpreis}
              handleInput={setKaufpreis} />
            <DataInput
              label='Modernisierungskosten'
              tooltip='Bitte hier eventuelle Modernisierungskosten eingeben, die mitfinanziert werden sollen'
              typeHint='€'
              defaultValue={modernKost}
              handleInput={setModernKost} />
            <SliderInput
              label='Grunderwerbssteuer'
              tooltip='Bitte hier Grunderwerbssteuersatz eingeben'
              typeHint='%'
              defaultValue={gest}
              handleInput={setGest} />
            <SliderInput
              label='Notar & Grundbuch'
              tooltip='Bitte hier Kosten für Notar und Grundbuchsatz eingeben'
              typeHint='%'
              defaultValue={notar}
              handleInput={setNotar} />
            <SliderInput
              label='Makler'
              tooltip='Bitte hier eventuelle Maklergebühren eingeben'
              typeHint='%'
              defaultValue={makler}
              handleInput={setMakler} />
            <SliderInput
              label='Zinsen (pro Jahr)'
              tooltip='Bitte hier den Zinssatz (pro Jahr) für das Darlehen eingeben. Der Zinssatz hat Einfluss auf die Annuität.'
              typeHint='%'
              defaultValue={zinsenJahr}
              handleInput={setZinsenJahr} />
            <SliderInput
              label='Tilgung (pro Jahr)'
              tooltip='Bitte hier die anfängliche Tilgung (pro Jahr) eingeben. Aus der Tilgungsrate geht die gesamte Laufzeit hervor. Tilgung sollte nicht 0 sein.'
              typeHint='%'
              defaultValue={tilgung}
              handleInput={setTilgung} />
            <SliderInput
              label='Instandhaltungsquote (pro Jahr)'
              tooltip='Bitte hier die geschätzte Instandhaltungsquote (pro Jahr) eingeben'
              typeHint='%'
              defaultValue={instand}
              handleInput={setInstand} />
            <SwitchInput
              label='Sparrate manuell festlegen'
              tooltip='Standardmäßig wird die Differenz der Mehrkosten von Mietpreis zu monatlicher Belastung bei Kauf mit der erwarteten Rendite investiert.'
              onValue={true}
              offValue={false}
              defaultState={false}
              handleInput={setSparManuell} />
            {sparManuell ? <DataInput
              label='Sparrate (manuell)'
              tooltip='Bitte die Sparrate bei Miete eintragen'
              defaultValue={Math.round(sparrate)}
              handleInput={setSparrate}
              typeHint='€' /> : <></>}
          </Grid>
        </CardContent>
      </Card>
      <Grid>
        <ResultOutput savings={vermoegenNetto - wertImmobilie} time={Math.ceil(abzahlenJahr)} />

      </Grid>
      <Grid size={{ md: 6 }}>
        <Card sx={{ marginBottom: 5, bgcolor: 'whitesmoke' }}>
          <CardContent>
            <Typography variant='h4'>Mieten</Typography>
            <Divider sx={{ marginBottom: 2 }}></Divider>
            <Grid container spacing={1.5} alignItems={"flex-end"}>

              <DataOutput
                label='Mietpreis durchschnitt Laufzeit (inkl. Inflation)'
                tooltip='Hier errechnet sich die durchschnittliche Miete (inkl. Inflation) für die Laufzeit'
                typeHint='€'
                value={mietpreis} />
              <DataOutput
                label='Sparrate (durchschnittlich)'
                tooltip='Hier errechnet sich die Sparratte. Gesamte monatliche Belastung bei Kauf minus Kaltmiete, oder manuell festgelegt.'
                typeHint='€'
                value={sparrate} />
              <DataOutput
                label='Vermögen Endwert'
                tooltip='Hier errechnet sich der Endwert des Vermögens nach der (hypothetischen) Laufzeit des Darlehens. Es wird davon ausgegangen, dass das Eigenkapital und die monatliche Sparrate angelegt werden.'
                typeHint='€'
                value={vermoegen} />
              <DataOutput
                label='Vermögen Endwert (nach Abzug Kapitalertragssteuer)'
                tooltip='Hier errechnet sich der Geldwert nach Verkauf der Investition (z.B. ETF) und Abzug der Kapitalertragssteuer. Es wurden 18,463 Kapitalertragssteuer angenommen. Das gilt aber nur für Aktien ETFs. Sonst 25%'
                typeHint='€'
                value={vermoegenNetto} />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ md: 6 }}>
        <Card sx={{ marginBottom: 5, bgcolor: 'whitesmoke' }}>
          <CardContent>
            <Typography variant='h4'>Kaufen</Typography>
            <Divider sx={{ marginBottom: 2 }}></Divider>
            <Grid container spacing={1.5} alignItems={"flex-end"}>

              <DataOutput
                label='Darlehen von der Bank insgesamt'
                tooltip='Hier errechnet sich der gesamte Darlehensbetrag'
                typeHint='€'
                value={darlehen} />
              <DataOutput
                label='Zinsen (pro Monat)'
                tooltip='Hier errechnet sich der Zinssatz pro Monat in Euro'
                typeHint='€'
                value={zinsenMonat} />
              <DataOutput
                label='Annuität'
                tooltip='Hier errechnet sich die Annuität für das Darlehen'
                typeHint='€'
                value={annuitaet} />
              <DataOutput
                label='Zeitraum Abzahlen (in Monaten)'
                tooltip='Hier errechnet sich die Dauer der Finanzierung in Monaten'
                value={abzahlenMonat} />
              <DataOutput
                label='Zeitraum Abzahlen (in Jahren)'
                tooltip='Hier errechnet sich die Dauer der Finanzierung in Jahren'
                value={abzahlenJahr} />
              <DataOutput
                label='Instandhaltung (durchschnittlich inkl. Inflation)'
                tooltip='Hier errechnet sich durchschnittlichen Instanthaltungskosten (inkl. Inflation)'
                typeHint='€'
                value={instantEuro} />
              <DataOutput
                label='Monatliche Belastung mit Instandhaltung'
                tooltip='Hier errechnet sich die gesamte monatliche Belastung für Finanzierung und Instandhaltung'
                typeHint='€'
                value={monatBelastung} />
              <DataOutput
                label='Gesamtaufwand'
                tooltip='Hier errechnet sich der Summe aller Aufwendungen bei Finanzierung der Immobilie'
                typeHint='€'
                value={gesamtBelastung} />
              <DataOutput
                label='Wert der Immobilie nach Laufzeit Darlehen'
                tooltip='Hier errechnet sich der Wert der Immobilie am Ende der Laufzeit'
                typeHint='€'
                value={wertImmobilie} />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Card sx={{ marginBottom: 5, bgcolor: 'whitesmoke' }}>
        <CardContent>
          <Grid container alignItems={'center'}>
            <Grid size={8}>

              <Typography variant='h4' sx={{ flexGrow: 1 }}>Tilgung und Zinsplan</Typography>
            </Grid>
            <Grid container size={4} justifyContent={'flex-end'}>

              <Button variant='contained' size='small' onClick={() => {
                createTilgungsplan()
                setShowTilgungsplan(!showTilgungsplan)
              }}>{showTilgungsplan ? 'ausblenden' : 'anzeigen'}</Button>
            </Grid>
          </Grid>
          <Divider sx={{ marginBottom: 2 }}></Divider>
          <Box sx={{ overflowX: 'auto' }}>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell >Rate</TableCell>
                  <TableCell>Annuität</TableCell>
                  <TableCell>Zins</TableCell>
                  <TableCell>Tilgung</TableCell>
                  <TableCell>Restschuld</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                {showTilgungsplan ?
                  tilgungsplan.map((v, i) => {
                    return (
                      <TableRow>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v.annuity)}</TableCell>
                        <TableCell>{Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v.zins)}</TableCell>
                        <TableCell>{Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v.tilgung)}</TableCell>
                        <TableCell>{Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v.rest)}</TableCell>
                      </TableRow>

                    )
                  }) : <></>}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 1 }}>

        <Button variant='text' color="secondary" startIcon={<VolunteerActivismIcon />} onClick={() => setOpen(true)}>
          Buy me a coffee
        </Button>
      </Box>

      <DonateDialog open={open} onClose={() => { setOpen(false) }} />

    </Container >
  )
}

export default App
