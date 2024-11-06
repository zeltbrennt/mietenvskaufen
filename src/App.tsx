import { Box, Link, Button, Card, CardContent, Container, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2';
import DataInput from './DataInput';
import DataOutput from './DataOutput';
import { useEffect, useState } from 'react';
import SliderInput from './SliderInput';
import ResultOutput from './ResultOutput';
import SwitchInput from './SwitchInput';
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

  useEffect(() => {
    setDarlehen(kaufpreis + modernKost + (kaufpreis / 100) * gest + (kaufpreis / 100) * notar + (kaufpreis / 100) * makler - eigenkapital)

  }, [kaufpreis, modernKost, gest, notar, makler, eigenkapital])

  useEffect(() => {
    setZinsenMonat(zinsenJahr / 100 / 12 * darlehen)

  }, [darlehen, zinsenJahr])

  useEffect(() => {
    setAnnuitaet(tilgung / 100 / 12 * darlehen + zinsenMonat)

  }, [tilgung, zinsenMonat, darlehen])

  useEffect(() => {
    const _rate = (zinsenJahr / 100 / 12)
    const _den = -darlehen * _rate + annuitaet
    const _abzahlenMonat = Math.log(annuitaet / _den) / Math.log(1 + _rate);
    setAbzahlenMonat(_abzahlenMonat)

  }, [annuitaet, zinsenJahr, darlehen])

  useEffect(() => {
    setAbzahlenJahr(abzahlenMonat / 12)
  }, [abzahlenMonat])

  useEffect(() => {
    setMietpreis(((kaltmiete * (1 + mietteuerung / 100) ** abzahlenJahr) + kaltmiete) / 2)
  }, [kaltmiete, mietteuerung, abzahlenJahr])

  useEffect(() => {
    const _totalAmnt = kaufpreis + modernKost
    const _rate = instand / 100 / 12
    setInstantEuro((((_totalAmnt * _rate) * (1 + inflation / 100) ** abzahlenJahr) + _totalAmnt * _rate) / 2)
  }, [inflation, kaufpreis, modernKost, abzahlenJahr, instand])

  useEffect(() => {
    setMonatBelastung(annuitaet + instantEuro)
  }, [annuitaet, instantEuro])

  useEffect(() => {
    setSparrate(monatBelastung - mietpreis)
  }, [monatBelastung, mietpreis])

  useEffect(() => {
    const _rate = rendite / 100
    const _pow = (1 + _rate) ** abzahlenJahr
    const _pmt = -sparrate * 12
    const _vermoegen = (_pmt * (1 - _pow) / _rate) + eigenkapital * _pow;
    setVermoegen(_vermoegen)
  }, [rendite, abzahlenJahr, eigenkapital, sparrate])

  useEffect(() => {
    setVermoegenNetto(vermoegen - ((vermoegen - (sparrate * 12 * abzahlenJahr)) * kapitalertragssteuer / 100))
  }, [vermoegen, sparrate, abzahlenJahr, kapitalertragssteuer])

  useEffect(() => {
    setGesamtBelastung(monatBelastung * 12 * abzahlenJahr + eigenkapital)
  }, [monatBelastung, abzahlenJahr, eigenkapital])

  useEffect(() => {
    setWertImmobilie((kaufpreis + modernKost) * (1 + wersteigerung / 100) ** abzahlenJahr)
  }, [kaufpreis, modernKost, wersteigerung, abzahlenJahr])




  interface tilgungsplanRow {
    rate: number,
    annuity: number,
    zins: number,
    tilgung: number,
    rest: number
  }

  const createTilgungsplan = () => {
    const plan: tilgungsplanRow[] = []
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
        bgcolor: 'lightslategray',
        borderRadius: '5px',
        paddingTop: 2,
        paddingBottom: 1,
        marginLeft: { xs: 0, md: 'auto' },
        marginRight: { xs: 0, md: 'auto' }
      }} >
      <Typography variant='h3' marginBottom={1} >Mieten vs. Kaufen</Typography>
      <Typography marginBottom={1}>
        inspiriert durch <Link sx={{ color: 'lightskyblue' }} href={"https://www.reddit.com/r/Finanzen/comments/1gjabd5/ich_pr%C3%A4sentiere_meinen_mieten_vs_kaufen_rechner/"} >diesen Post</Link> auf Reddit von <Link sx={{ color: 'lightskyblue' }} href={"https://www.reddit.com/user/nothingtohidemic"}>/u/nothingtohidemic</Link>
      </Typography>
      <Typography marginBottom={2}>
        Es wird verglichen, inwieweit es sich lohnt weiter zur Miete zur Wohnen oder eine Immobilie zu kaufen. Dabei wird davon ausgegangen, dass die Differenz zum Mehraufwand bei Kauf investiert wird.
      </Typography>
      <Card sx={{ marginBottom: 5, bgcolor: 'whitesmoke' }}>
        <CardContent>
          <Typography variant='h4'>Annahmen</Typography>
          <Divider sx={{ marginBottom: 2 }}></Divider>
          <Grid container spacing={1.5} alignItems={"flex-end"}>
            <SliderInput
              label='Inflation'
              tooltip='Bitte angenommene Inflation pro Jahr eintragen'
              defaultValue={inflation}
              handleInput={setInflation}
            />
            <SliderInput
              label='Mietteuerungsrate'
              tooltip='Bitte angenommene Mieterhöhung pro Jahr eintragen'
              defaultValue={mietteuerung}
              handleInput={setMietteuerung} />
            <SliderInput
              label='Durchschnittliche Wertsteigerung Immobilie pro Jahr'
              tooltip='Bitte angenommene Wertsteigerung der Immobilie pro Jahr eintragen'
              defaultValue={wersteigerung}
              handleInput={setWertsteigerung} />
            <SliderInput
              label='Durchschnittliche Rendite Invest pro Jahr'
              tooltip='Bitte angenommene Rendite für Investitionen pro Jahr eintragen'
              defaultValue={rendite}
              handleInput={setRendite} />
            <SwitchInput
              label='Ausschießlich Aktien-ETF'
              tooltip='Kapitalertragssteuer liegt bei 25%, bei Aktien-ETFs jedoch nur 18.46%'
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
              label='Notar + Grundbuch'
              tooltip='Bitte hier Notar + Grundbuchsatz eingeben'
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
              tooltip='Bitte hier den Zinssatz (pro Jahr) eingeben'
              typeHint='%'
              defaultValue={zinsenJahr}
              handleInput={setZinsenJahr} />
            <SliderInput
              label='Tilgung'
              tooltip='Bitte hier die anfängliche Tilgung eingeben'
              typeHint='%'
              defaultValue={tilgung}
              handleInput={setTilgung} />
            <SliderInput
              label='Instandhaltungsquote'
              tooltip='Bitte hier die geschätzte Instandhaltungsquote eingeben'
              typeHint='%'
              defaultValue={instand}
              handleInput={setInstand} />
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
                tooltip='Hier errechnet sich die durchschnittliche Miete (incl. Inflation) für die Laufzeit'
                typeHint='€'
                value={mietpreis} />
              <DataOutput
                label='Sparrate (durchschnittlich)'
                tooltip='Hier errechnet sich die Sparratte. Gesamte monatliche Belastung bei kauf minus Kaltmiete.'
                typeHint='€'
                value={sparrate} />
              <DataOutput
                label='Vermögen Endwert'
                tooltip='Hier errechnet sich der Endwert des Vermögens nach der Laufzeit'
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
                tooltip='Hier errechnet sich der Zinssatz pro Monat'
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
                tooltip='Hier errechnet sich durchschnittlichen Instanthaltungskosten inkl. Inflation'
                typeHint='€'
                value={instantEuro} />
              <DataOutput
                label='Monatliche Belastung mit Instandhaltung'
                tooltip='Hier errechnet sich die ges. monatliche Belastung für Finanzierung und Instandhaltung'
                typeHint='€'
                value={monatBelastung} />
              <DataOutput
                label='Gesamtaufwand'
                tooltip='Hier errechnet sich der Wert, den die Immobilie am Ende der Laufzeit gekostet hat'
                typeHint='€'
                value={gesamtBelastung} />
              <DataOutput
                label='Wert der Immobilie nach Laufzeit Darlehen'
                tooltip='Hier errechnet sich der Wert der Immobilie am Ende der Laufzeit '
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
    </Container >
  )
}

export default App
