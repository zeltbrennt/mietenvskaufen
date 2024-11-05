import { Card, CardContent, Container, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
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

  const [tilgungsplan, setTilgungsplan] = useState<number[]>([])


  useEffect(() => {
    setDarlehen(kaufpreis + modernKost + (kaufpreis / 100) * gest + (kaufpreis / 100) * notar + (kaufpreis / 100) * makler - eigenkapital)
  }, [eigenkapital, kaufpreis, modernKost, gest, notar, makler])

  useEffect(() => {
    setZinsenMonat(zinsenJahr / 100 / 12 * darlehen)
  }, [zinsenJahr, darlehen])

  useEffect(() => {
    setAnnuitaet(tilgung / 100 / 12 * darlehen + zinsenMonat)
  }, [zinsenMonat, tilgung, darlehen])

  useEffect(() => {
    const rate = (zinsenJahr / 100 / 12)
    const den = -darlehen * rate + annuitaet
    setAbzahlenMonat(Math.log(annuitaet / den) / Math.log(1 + rate))
  }, [zinsenJahr, annuitaet, darlehen])

  useEffect(() => {
    setAbzahlenJahr(abzahlenMonat / 12)
  }, [abzahlenMonat])

  useEffect(() => {
    setMietpreis(((kaltmiete * (1 + mietteuerung / 100) ** abzahlenJahr) + kaltmiete) / 2)
  }, [mietteuerung, abzahlenJahr, kaltmiete])

  useEffect(() => {
    const totalAmnt = kaufpreis + modernKost
    const rate = instand / 100 / 12
    setInstantEuro((((totalAmnt * rate) * (1 + inflation / 100) ** abzahlenJahr) + totalAmnt * rate) / 2)
  }, [kaufpreis, modernKost, instand, inflation, abzahlenJahr])

  useEffect(() => {
    setMonatBelastung(annuitaet + instantEuro)
  }, [annuitaet, instantEuro])

  useEffect(() => {
    setSparrate(monatBelastung - mietpreis)
  }, [monatBelastung, mietpreis])

  useEffect(() => {
    const pmt = -sparrate * 12
    const rate = rendite / 100
    const pow = (1 + rate) ** abzahlenJahr
    setVermoegen((pmt * (1 - pow) / rate) + eigenkapital * pow)
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

  useEffect(() => {
    const plan = []
    let rest = darlehen
    plan.push(rest)
    for (let i = 1; i < abzahlenMonat; i++) {
      const z = zinsenJahr / 100 / 12 * rest
      const a = Math.min(annuitaet, rest + z)
      const t = a - z
      rest -= t
      plan.push(rest)
    }
    setTilgungsplan(plan)
  }, [darlehen, abzahlenMonat, annuitaet])


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

      <Typography variant='h4'>Tilgung und Zinsplan</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rate</TableCell>
            <TableCell>Annuität</TableCell>
            <TableCell>Zins</TableCell>
            <TableCell>Tilgung</TableCell>
            <TableCell>Restschuld</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {
            tilgungsplan.map((v, i) => {
              const z = zinsenJahr / 100 / 12 * v
              const a = Math.min(annuitaet, v + z)
              const t = a - z
              return (
                <TableRow>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(a)}</TableCell>
                  <TableCell>{Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(z)}</TableCell>
                  <TableCell>{Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(t)}</TableCell>
                  <TableCell>{Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v - t)}</TableCell>
                </TableRow>

              )
            })}
        </TableBody>
      </Table>
    </Container >
  )
}

export default App
