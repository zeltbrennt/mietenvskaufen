import { Button, Card, CardActionArea, CardActions, CardContent, Container, Divider, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2';
import DataInput from './DataInput';
import DataOutput from './DataOutput';
import { useEffect, useState } from 'react';
function App() {

  const [kapitalertragssteuer, setKapitalertrtagssteuer] = useState(18.463)
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
    const _totalAmnt = kaufpreis + modernKost
    const _darlehen = _totalAmnt + (kaufpreis / 100) * gest + (kaufpreis / 100) * notar + (kaufpreis / 100) * makler - eigenkapital
    const _zinsenMonat = zinsenJahr / 100 / 12 * _darlehen
    const _annuitaet = tilgung / 100 / 12 * _darlehen + _zinsenMonat;
    let _rate = (zinsenJahr / 100 / 12)
    const _den = -_darlehen * _rate + _annuitaet
    const _abzahlenMonat = Math.log(_annuitaet / _den) / Math.log(1 + _rate);
    const _abzahlenJahr = _abzahlenMonat / 12;
    const _mietpreis = ((kaltmiete * (1 + mietteuerung / 100) ** _abzahlenJahr) + kaltmiete) / 2;
    _rate = instand / 100 / 12
    const _instandEuro = (((_totalAmnt * _rate) * (1 + inflation / 100) ** _abzahlenJahr) + _totalAmnt * _rate) / 2;
    const _monatBelastung = annuitaet + instantEuro;
    const _sparrate = _monatBelastung - _mietpreis;
    const _pmt = -_sparrate * 12
    _rate = rendite / 100
    const _pow = (1 + _rate) ** _abzahlenJahr
    const _vermoegen = (_pmt * (1 - _pow) / _rate) + eigenkapital * _pow;
    const _vermoegenNetto = _vermoegen - ((_vermoegen - (_sparrate * 12 * _abzahlenJahr)) * kapitalertragssteuer / 100);
    const _gesamtBelastung = _monatBelastung * 12 * _abzahlenJahr + eigenkapital;
    const _wertImmobilie = _totalAmnt * (1 + wersteigerung / 100) ** _abzahlenJahr;
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

  }, [
    inflation, mietteuerung, wersteigerung, rendite, eigenkapital, kaltmiete,
    kaufpreis, modernKost, gest, notar, makler, zinsenJahr, tilgung, instand, kapitalertragssteuer
  ])

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
    <Container maxWidth='md'>
      <Typography variant='h3' marginBottom={2}>Mieten vs. Kaufen</Typography>
      <Card sx={{ marginBottom: 5 }}>
        <CardContent>
          <Typography variant='h4'>Annahmen</Typography>
          <Divider sx={{ marginBottom: 2 }}></Divider>
          <Grid container spacing={1.5}>
            <DataInput
              label='Inflation'
              tooltip='Bitte angenommene Inflation pro Jahr eintragen'
              typeHint='%'
              defaultValue={inflation}
              handleInput={setInflation} />
            <DataInput
              label='Mietteuerungsrate'
              tooltip='Bitte angenommene Mieterhöhung pro Jahr eintragen'
              typeHint='%'
              defaultValue={mietteuerung}
              handleInput={setMietteuerung} />
            <DataInput
              label='Durchschnittliche Wertsteigerung Immobilie pro Jahr'
              tooltip='Bitte angenommene Wertsteigerung der Immobilie pro Jahr eintragen'
              typeHint='%'
              defaultValue={wersteigerung}
              handleInput={setWertsteigerung} />
            <DataInput
              label='Durchschnittliche Rendite Invest pro Jahr'
              tooltip='Bitte angenommene Rendite für Investitionen pro Jahr eintragen'
              typeHint='%'
              defaultValue={rendite}
              handleInput={setRendite} />
            <DataInput
              label='Kapitalertragssteuer'
              tooltip='Bitte Kapitalertragssteuer eintragen. 18.463 % gilt nur für Aktien-ETFs, sonst 25 %'
              typeHint='%'
              defaultValue={kapitalertragssteuer}
              handleInput={setKapitalertrtagssteuer} />
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ marginBottom: 5 }}>
        <CardContent>
          <Typography variant='h4'>Eckdaten</Typography>
          <Divider sx={{ marginBottom: 2 }}></Divider>
          <Grid container spacing={1.5}>
            <DataInput
              label='Eigenkapital'
              tooltip='Bitte jetzt verfügbares Eigenkapital eintragen'
              typeHint='€'
              defaultValue={eigenkapital}
              handleInput={setEigenkapital} />
            <DataInput
              label='Mietpreis kalt (heute)'
              tooltip='Bitte hier die Kaltmiete eintragen'
              typeHint='€'
              defaultValue={kaltmiete}
              handleInput={setKaltmiete} />
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
            <DataInput
              label='Grunderwerbssteuer'
              tooltip='Bitte hier Grunderwerbssteuersatz eingeben'
              typeHint='%'
              defaultValue={gest}
              handleInput={setGest} />
            <DataInput
              label='Notar + Grundbuch'
              tooltip='Bitte hier Notar + Grundbuchsatz eingeben'
              typeHint='%'
              defaultValue={notar}
              handleInput={setNotar} />
            <DataInput
              label='Makler'
              tooltip='Bitte hier eventuelle Maklergebühren eingeben'
              typeHint='%'
              defaultValue={makler}
              handleInput={setMakler} />
            <DataInput
              label='Zinsen (pro Jahr)'
              tooltip='Bitte hier den Zinssatz (pro Jahr) eingeben'
              typeHint='%'
              defaultValue={zinsenJahr}
              handleInput={setZinsenJahr} />
            <DataInput
              label='Tilgung'
              tooltip='Bitte hier die anfängliche Tilgung eingeben'
              typeHint='%'
              defaultValue={tilgung}
              handleInput={setTilgung} />
            <DataInput
              label='Instandhaltungsquote'
              tooltip='Bitte hier die geschätzte Instandhaltungsquote eingeben'
              typeHint='%'
              defaultValue={instand}
              handleInput={setInstand} />
          </Grid>
        </CardContent>
      </Card>
      <Grid size={{ md: 6 }}>
        <Card sx={{ marginBottom: 5 }}>
          <CardContent>
            <Typography variant='h4'>Ergebnisse</Typography>
            <Divider sx={{ marginBottom: 2 }}></Divider>
            <Grid container spacing={1.5}>

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
              <DataOutput
                label='Anfangskapital'
                tooltip='Gleich dem Eigenkapital oben'
                value={eigenkapital}
                typeHint='€' />
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
              <DataOutput
                label='Wenn man mietet, hat man so viel mehr'
                tooltip='Hier errechnet sich ob Mieten oder Kaufen zu mehr Vermögen führt.Positiver Wert: Mieten ist besserNegativer Wert: Kaufen ist besser'
                typeHint='€'
                value={vermoegenNetto - wertImmobilie} />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Card>
        <CardContent>
          <Stack direction='row' sx={{ display: 'flex', alignContent: 'space-between' }}>
            <Typography variant='h4' sx={{ flexGrow: 1 }}>Tilgung und Zinsplan</Typography>
            <Button variant='outlined' size='small' onClick={() => {
              createTilgungsplan()
              setShowTilgungsplan(!showTilgungsplan)
            }}>{showTilgungsplan ? 'ausblenden' : 'anzeigen'}</Button>
          </Stack>
          <Divider sx={{ marginBottom: 2 }}></Divider>
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
        </CardContent>
      </Card>
    </Container >
  )
}

export default App
