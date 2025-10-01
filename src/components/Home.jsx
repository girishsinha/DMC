import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

// Dummy categories – replace with API driven if needed
const personalOptions = ["John", "Tom", "Emily"];
const professionalOptions = ["Accounts", "HR", "IT", "Finance"];

export default function Home() {
  const [majorHead, setMajorHead] = useState("");
  const [minorHead, setMinorHead] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [results, setResults] = useState([]);

  const { token, userId } = useUser().user.data;

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (t) => {
    setTags(tags.filter((tag) => tag !== t));
  };

  const handleSearch = async () => {
    const body = {
      major_head: majorHead,
      minor_head: minorHead,
      from_date: fromDate ? format(fromDate, "dd-MM-yyyy") : "",
      to_date: toDate ? format(toDate, "dd-MM-yyyy") : "",
      tags: tags.map((t) => ({ tag_name: t })),
      uploaded_by: "",
      start: 0,
      length: 10,
      filterId: "",
      search: { value: "" },
    };

    try {
      const res = await fetch(
        "https://apis.allsoft.co/api/documentManagement//searchDocumentEntry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      setResults(data.data || []);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleDownload = (file) => {
    window.open(file.url, "_blank");
  };

  const handleDownloadAll = () => {
    // for now simulate zip download
    alert("Download all as ZIP (to be implemented)");
  };

  const renderPreview = (file) => {
    if (file.type === "pdf") {
      return (
        <iframe src={file.url} width="100%" height="300" title="pdf preview" />
      );
    }
    if (["jpg", "jpeg", "png"].includes(file.type)) {
      return <img src={file.url} alt="preview" className="max-h-64" />;
    }
    return <p>Preview not available for {file.type} files</p>;
  };

  return (
    <div className="space-y-4 h-full w-2xl p-6">
      <div className="flex flex-col sticky top-0 gap-4 ">
        {/* Tags */}
        <div className="flex flex-row gap-2 items-center ">
          {tags.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-1 border rounded px-2 py-1"
            >
              {t}
              <button type="button" onClick={() => handleRemoveTag(t)}>
                x
              </button>
            </div>
          ))}
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            placeholder="Add tag"
          />
          {/* Search button */}
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="flex gap-2">
          {/* Category selection */}
          <Select onValueChange={setMajorHead}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Professional">Professional</SelectItem>
            </SelectContent>
          </Select>

          {majorHead === "Personal" && (
            <Select onValueChange={setMinorHead}>
              <SelectTrigger>
                <SelectValue placeholder="Select Name" />
              </SelectTrigger>
              <SelectContent>
                {personalOptions.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {majorHead === "Professional" && (
            <Select onValueChange={setMinorHead}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {professionalOptions.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Date pickers */}
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {fromDate ? format(fromDate, "PPP") : "From Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {toDate ? format(toDate, "PPP") : "To Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 space-y-4">
        {results.length > 0 && (
          <>
            <Button onClick={handleDownloadAll}>Download All as ZIP</Button>
            {results.map((file, i) => (
              <div key={i} className="border rounded p-4 space-y-2">
                <p>
                  <b>{file.file_name}</b>
                </p>
                {renderPreview(file)}
                <Button onClick={() => handleDownload(file)}>Download</Button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
