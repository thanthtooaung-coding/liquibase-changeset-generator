"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [inputData, setInputData] = useState("")
  const [changeSetId, setChangeSetId] = useState("001_insert_address_data")
  const [author, setAuthor] = useState("your_name")
  const [tableName, setTableName] = useState("ct_uov")
  // const [generatedXml] = useState("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setInputData(event.target.result as string)
        }
      }
      reader.readAsText(file)
    }
  }

  // const handleCopy = () => {
  //   navigator.clipboard.writeText(generatedXml)
  // }

  // const handleDownload = () => {
  //   const blob = new Blob([generatedXml], { type: "text/xml" })
  //   const url = URL.createObjectURL(blob)
  //   const a = document.createElement("a")
  //   a.href = url
  //   a.download = `${changeSetId}.xml`
  //   document.body.appendChild(a)
  //   a.click()
  //   document.body.removeChild(a)
  //   URL.revokeObjectURL(url)
  // }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Liquibase ChangeSet Generator</h1>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              For your specific data format, please use the{" "}
              <Link href="/advanced" className="font-medium underline">
                Advanced Parser
              </Link>{" "}
              which is optimized for your data structure.
            </p>
          </div>
        </div>
      </div>

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
            <div className="flex justify-between">
              <Label htmlFor="inputData">Paste your data here or upload a file</Label>
              <div className="relative">
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileUpload"
                  accept=".txt,.csv,.xlsx"
                />
                <Label htmlFor="fileUpload" className="cursor-pointer flex items-center text-sm text-blue-600">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload File
                </Label>
              </div>
            </div>
            <Textarea
              id="inputData"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Paste your data here..."
              className="min-h-[300px] font-mono"
            />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-sm text-blue-700">
              For your specific data format with columns for Town_Pcode, Town_Name_Eng, Town_Name_MMR, and Tsp_Pcode,
              please use the{" "}
              <Link href="/advanced" className="font-medium underline">
                Advanced Parser
              </Link>{" "}
              which is optimized for this structure.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/advanced" className="w-full">
            <Button className="w-full">Go to Advanced Parser</Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
