"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Copy, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ParsedEntry {
  name: string
  nameMm: string
  code: string
  townshipCode: string
  isUrban: boolean
}

export default function AdvancedPage() {
  const [inputData, setInputData] = useState("")
  const [changeSetId, setChangeSetId] = useState("004_insert_address_data")
  const [author, setAuthor] = useState("your_name")
  const [tableName, setTableName] = useState("ct_uov")
  const [generatedXml, setGeneratedXml] = useState("")
  const [parsedData, setParsedData] = useState<ParsedEntry[]>([])
  const [parseStatus, setParseStatus] = useState("")
  const [delimiter, setDelimiter] = useState("tab")

  const parseData = () => {
    try {
      const lines = inputData.trim().split("\n")
      const entries: ParsedEntry[] = []

      const delimiterChar = delimiter === "tab" ? "\t" : delimiter === "comma" ? "," : " "

      let currentIsUrban = true

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        if (!line) continue

        if (line.startsWith("is_urban true")) {
          currentIsUrban = true
          continue
        }

        if (line.startsWith("is_urban false")) {
          currentIsUrban = false
          continue
        }

        if (line.startsWith("SR_Pcode") || line.includes("Township_Name_Eng")) {
          continue
        }

        if (line.startsWith("---")) {
          continue
        }

        let parts: string[]
        if (delimiter === "space") {
          parts = line.split(/\s+/)
        } else {
          parts = line.split(delimiterChar)
        }

        // Check if we have enough columns
        if (parts.length >= 9) {
          // Extract data based on the specified column positions
          // Town_Pcode is column 7 (index 6)
          // Town_Name_Eng is column 8 (index 7)
          // Town_Name_MMR is column 9 (index 8)
          // Tsp_Pcode is column 5 (index 4)
          const entry: ParsedEntry = {
            code: parts[6]?.trim() || "",
            name: parts[7]?.trim() || "",
            nameMm: parts[8]?.trim() || "",
            townshipCode: parts[4]?.trim() || "",
            isUrban: currentIsUrban,
          }

          if (entry.code && entry.townshipCode) {
            entries.push(entry)
          }
        }
      }

      setParsedData(entries)
      setParseStatus(`Successfully parsed ${entries.length} entries.`)
    } catch (error) {
      console.error("Error parsing data:", error)
      setParseStatus("Error parsing data. Please check your input format.")
    }
  }

  const generateXml = () => {
    if (parsedData.length === 0) {
      setGeneratedXml("Please parse the data first before generating XML.")
      return
    }

    try {
      let xml = `<changeSet id="${changeSetId}" author="${author}">\n`

      for (const entry of parsedData) {
        xml += `        <insert tableName="${tableName}">\n`
        xml += `            <column name="name" value="${entry.name}"/>\n`
        xml += `            <column name="name_mm" value="${entry.nameMm}"/>\n`
        xml += `            <column name="code" value="${entry.code}"/>\n`
        xml += `            <column name="active" value="1"/>\n`
        xml += `            <column name="is_urban" value="${entry.isUrban ? "1" : "0"}"/>\n`
        xml += `            <column name="township_id" valueComputed="(SELECT id FROM ct_township WHERE code = '${entry.townshipCode}')"/>\n`
        xml += `        </insert>\n\n`
      }

      xml += `    </changeSet>`

      setGeneratedXml(xml)
    } catch (error) {
      console.error("Error generating XML:", error)
      setGeneratedXml("Error generating XML. Please check your parsed data.")
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedXml)
  }

  const handleDownload = () => {
    const blob = new Blob([generatedXml], { type: "text/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${changeSetId}.xml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Liquibase ChangeSet Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="changeSetId">ChangeSet ID</Label>
                <Input
                  id="changeSetId"
                  value={changeSetId}
                  onChange={(e) => setChangeSetId(e.target.value)}
                  placeholder="ChangeSet ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tableName">Table Name</Label>
              <Input
                id="tableName"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Table Name"
              />
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="inputData">Paste your data here</Label>
              <Textarea
                id="inputData"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Paste your data here..."
                className="min-h-[300px] font-mono"
              />
            </div>

            {parseStatus && <div className="text-sm font-medium text-blue-600">{parseStatus}</div>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={parseData} variant="outline">
              Parse Data
            </Button>
            <Button onClick={generateXml} disabled={parsedData.length === 0}>
              Generate XML
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated XML</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={generatedXml} readOnly className="min-h-[400px] font-mono" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleCopy} variant="outline" className="flex items-center">
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button onClick={handleDownload} className="flex items-center" disabled={!generatedXml}>
              <Download className="h-4 w-4 mr-2" />
              Download XML
            </Button>
          </CardFooter>
        </Card>
      </div>

      {parsedData.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Parsed Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md overflow-auto max-h-[300px] border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Name MM</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Township Code</TableHead>
                    <TableHead>Is Urban</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.slice(0, 10).map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.nameMm}</TableCell>
                      <TableCell>{entry.code}</TableCell>
                      <TableCell>{entry.townshipCode}</TableCell>
                      <TableCell>{entry.isUrban ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {parsedData.length > 10 && (
              <div className="text-center mt-2 text-sm text-gray-500">Showing 10 of {parsedData.length} entries</div>
            )}
          </CardContent>
        </Card>
      )}
    </main>
  )
}
