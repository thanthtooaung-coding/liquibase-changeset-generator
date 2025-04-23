"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface ParsedEntry {
  name: string
  nameMm: string
  code: string
  townshipCode: string
}

export function AdvancedParser() {
  const [inputData, setInputData] = useState("")
  const [parsedData, setParsedData] = useState<ParsedEntry[]>([])
  const [parseStatus, setParseStatus] = useState("")

  const parseData = () => {
    try {
      // Split the input into lines
      const lines = inputData.trim().split("\n")
      const entries: ParsedEntry[] = []

      // Process each line
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line || line.startsWith("is_urban")) continue // Skip empty lines or headers

        // Extract the data using regex or string operations
        const parts = line.split(/\s+/)

        if (parts.length >= 3) {
          // This is a simplified approach - you'll need to adjust based on your actual data format
          const code = parts[0] // Assuming first column is the code
          const townshipCode = parts[parts.length - 1] // Assuming last column is township code

          // For name and name_mm, we need to look at the next line or parse more carefully
          // This is just a placeholder - you'll need to adjust based on your data
          const name = "Location Name"
          const nameMm = "မြန်မာနာမည်"

          entries.push({
            code,
            name,
            nameMm,
            townshipCode,
          })
        }
      }

      setParsedData(entries)
      setParseStatus(`Successfully parsed ${entries.length} entries.`)
    } catch (error) {
      console.error("Error parsing data:", error)
      setParseStatus("Error parsing data. Please check your input format.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Data Parser</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="advancedInput">Paste your data for advanced parsing</Label>
          <Textarea
            id="advancedInput"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Paste your data here..."
            className="min-h-[300px] font-mono"
          />
        </div>

        {parseStatus && <div className="text-sm font-medium text-blue-600">{parseStatus}</div>}

        {parsedData.length > 0 && (
          <div className="space-y-2">
            <Label>Preview of Parsed Data (First 5 entries)</Label>
            <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[200px]">
              <pre className="text-xs">{JSON.stringify(parsedData.slice(0, 5), null, 2)}</pre>
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
