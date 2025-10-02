import { useState, useEffect } from "react";
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
import { format, set } from "date-fns";
import { useNavigate } from "react-router-dom";

import { useUser } from "@/context/userContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Command, CommandGroup, CommandInput, CommandItem } from "./ui/command";

// Dummy dropdown values
const personalOptions = ["John", "Tom", "Emily"];
const professionalOptions = ["Accounts", "HR", "IT", "Finance"];

export default function FileSearchWithPagination() {
  const { token, userId } = useUser().user.data;

  const [majorHead, setMajorHead] = useState("");
  const [minorHead, setMinorHead] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [suggestion, setSuggestiont] = useState([]);

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const fetchData = async () => {
    const body = {
      major_head: majorHead,
      minor_head: minorHead,
      from_date: fromDate ? format(fromDate, "yyyy-MM-dd") : "",
      to_date: toDate ? format(toDate, "yyyy-MM-dd") : "",
      tags: tags.map((t) => ({ tag_name: t })),
      uploaded_by: "",
      start: page * pageSize,
      length: pageSize,
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
      setTotal(data.recordsTotal || 0);
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  // Auto-fetch on page/filters change
  useEffect(() => {
    console.log("called");
    if (token) fetchData();
  }, [page, majorHead, minorHead, fromDate, toDate, tags]);

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
      setSuggestiont([]);
    }
  };

  const handleRemoveTag = (t) => {
    setTags(tags.filter((tag) => tag !== t));
  };

  const renderPreview = (file) => {
    if (file.file_url.endsWith(".pdf")) {
      return (
        <iframe
          src={file.file_url}
          width="100%"
          height="250"
          title="pdf preview"
        />
      );
    }
    if (file.file_url.match(/\.(jpg|jpeg|png)$/i)) {
      return (
        <img src={file.file_url} alt="preview" className="max-h-64 rounded" />
      );
    }
    return <p>Preview not available</p>;
  };

  useEffect(() => {
    const fetchTags = async () => {
      if (!tagInput.trim()) return;

      try {
        const res = await fetch(
          "https://apis.allsoft.co/api/documentManagement/documentTags",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
            body: JSON.stringify({ term: tagInput }),
          }
        );
        const data = await res.json();
        console.log("Fetched tags:", data);
        setSuggestiont(data.data);
        console.log(suggestion);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };

    fetchTags();
  }, [tagInput]);

  const navigate = useNavigate();

  return (
    <div className="space-y-4 h-full ">
      <div className="sticky top-0 bg-background p-6 ">
        <div className=" relative">
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              placeholder="Search by Tags"
            />
            <Button onClick={handleAddTag}>Search</Button>
          </div>
          {suggestion.length !== 0 && (
            <Card className="absolute z-10 w-full overflow-y-scroll max-h-120  ">
              <ul className="bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md">
                {suggestion.map((tag) => (
                  <li
                    onClick={() => setTagInput(tag.label)}
                    key={tag.id}
                    className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer"
                  >
                    {tag.label}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Tags */}
          <div className="flex gap-2  ">
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
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 items-center">
          {/* Major head */}
          <Select onValueChange={setMajorHead}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Professional">Professional</SelectItem>
            </SelectContent>
          </Select>

          {/* Minor head */}
          {majorHead && (
            <Select onValueChange={setMinorHead}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${majorHead}`} />
              </SelectTrigger>
              <SelectContent>
                {(majorHead === "Personal"
                  ? personalOptions
                  : professionalOptions
                ).map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
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
          <Button onClick={() => navigate("/upload")}> Upload File</Button>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 space-y-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {results.map((file) => (
          <Card key={file.document_id} className="w-full max-w-sm ">
            <CardHeader>
              <CardTitle>{file.major_head}</CardTitle>
              <CardDescription>{file.minor_head}</CardDescription>
            </CardHeader>
            <CardContent>
              {file.document_remarks}

              {renderPreview(file)}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(file.file_url, "_blank")}
              >
                Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}

      <Pagination>
        <PaginationContent>
          {page !== 0 && (
            <>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage((p) => p - 1)} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => setPage((p) => p - 1)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationLink isActive>{page + 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              disabled={(page + 1) * pageSize >= total}
              onClick={() => setPage((p) => p + 1)}
            >
              {page + 2}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis totalPage={Math.ceil(total / pageSize)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              disabled={(page + 1) * pageSize >= total}
              onClick={() => setPage((p) => p + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
