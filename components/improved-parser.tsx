"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ParsedEntry {
  name: string
  nameMm: string
  code: string
  townshipCode: string
}

export function ImprovedParser() {
  const [inputData, setInputData] = useState("")
  const [parsedData, setParsedData] = useState<ParsedEntry[]>([])
  const [nameColumnIndex, setNameColumnIndex] = useState(1)
  const [nameMmColumnIndex, setNameMmColumnIndex] = useState(2)
  const [codeColumnIndex, setCodeColumnIndex] = useState(0)
  const [townshipCodeColumnIndex, setTownshipCodeColumnIndex] = useState(4)
  const [delimiter, setDelimiter] = useState("tab")
  const [parseStatus, setParseStatus] = useState("")

  const parseData = () => {
    try {
      const lines = inputData.trim().split("\n")
      const entries: ParsedEntry[] = []

      const delimiterChar = delimiter === "tab" ? "\t" : delimiter === "comma" ? "," : " "

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue 

        let parts: string[]
        if (delimiter === "space") {
          parts = line.split(/\s+/)
        } else {
          parts = line.split(delimiterChar)
        }

        if (parts.length > Math.max(nameColumnIndex, nameMmColumnIndex, codeColumnIndex, townshipCodeColumnIndex)) {
          const entry: ParsedEntry = {
            name: parts[nameColumnIndex].trim(),
            nameMm: parts[nameMmColumnIndex].trim(),
            code: parts[codeColumnIndex].trim(),
            townshipCode: parts[townshipCodeColumnIndex].trim(),
          }

          entries.push(entry)
        }
      }

      setParsedData(entries)
      setParseStatus(`Successfully parsed ${entries.length} entries.`)
    } catch (error) {
      console.error("Error parsing data:", error)
      setParseStatus("Error parsing data. Please check your input format and column indices.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Improved Data Parser</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="delimiter">Delimiter</Label>
            <select
              id="delimiter"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="tab">Tab</option>
              <option value="comma">Comma</option>
              <option value="space">Space</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nameColumnIndex">Name Column Index</Label>
            <Input
              id="nameColumnIndex"
              type="number"
              value={nameColumnIndex}
              onChange={(e) => setNameColumnIndex(Number.parseInt(e.target.value))}
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameMmColumnIndex">Name MM Column Index</Label>
            <Input
              id="nameMmColumnIndex"
              type="number"
              value={nameMmColumnIndex}
              onChange={(e) => setNameMmColumnIndex(Number.parseInt(e.target.value))}
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codeColumnIndex">Code Column Index</Label>
            <Input
              id="codeColumnIndex"
              type="number"
              value={codeColumnIndex}
              onChange={(e) => setCodeColumnIndex(Number.parseInt(e.target.value))}
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="townshipCodeColumnIndex">Township Code Column Index</Label>
            <Input
              id="townshipCodeColumnIndex"
              type="number"
              value={townshipCodeColumnIndex}
              onChange={(e) => setTownshipCodeColumnIndex(Number.parseInt(e.target.value))}
              min="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="improvedInput">Paste your data for parsing</Label>
          <Textarea
            id="improvedInput"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Paste your data here..."
            className="min-h-[200px] font-mono"
          />
        </div>

        {parseStatus && <div className="text-sm font-medium text-blue-600">{parseStatus}</div>}

        {parsedData.length > 0 && (
          <div className="space-y-2">
            <Label>Preview of Parsed Data (First 5 entries)</Label>
            <div className="rounded-md overflow-auto max-h-[200px] border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Name MM</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Township Code</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.slice(0, 5).map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.nameMm}</TableCell>
                      <TableCell>{entry.code}</TableCell>
                      <TableCell>{entry.townshipCode}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={parseData} className="w-full">
          Parse Data
        </Button>
      </CardFooter>
    </Card>
  )
}
