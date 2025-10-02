import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useUser } from "@/context/userContext";
import { Card } from "./ui/card";
import { Label } from "./ui/label";

const TAGS_API = "https://apis.allsoft.co/api/documentManagement/getTags";
const SAVE_API =
  "https://apis.allsoft.co/api/documentManagement/saveDocumentEntry";

const NAMES = ["nitin", "Girish", "gaurav"];
const DEPARTMENTS = ["Accounts", "HR", "IT", "Finance"];

function UploadFile() {
  const [preview, setPreview] = useState(null);

  const [date, setDate] = useState();
  const [majorHead, setMajorHead] = useState("");
  const [minorHead, setMinorHead] = useState("");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);

  const { token, user_Id } = useUser().user.data;
  // const
  // console.log(user);

  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (t) => {
    setTags(
      tags.filter((tag) => {
        return tag !== t;
      })
    );
  };

  const handleSubmit = async () => {
    if (!file || !date || !minorHead) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "data",
      JSON.stringify({
        major_head: majorHead,
        minor_head: minorHead,
        document_date: format(date, "dd-MM-yyyy"),
        document_remarks: remarks,
        tags: tags.map((t) => ({ tag_name: t })),
        user_id: user_Id,
      })
    );
    // debug: inspect contents

    for (const [key, value] of formData.entries()) {
      console.log("formData entry:", key, value);
    }
    console.log("file instanceof File?", file instanceof File, file);

    const res = await fetch(
      "https://apis.allsoft.co/api/documentManagement//saveDocumentEntry",
      {
        method: "POST",
        headers: { token: token },
        body: formData,
      }
    );

    const result = await res.json();
    console.log("Upload Response:", result);

    if (result.status) {
      alert(result.message || "Upload successful");
    } else {
      alert(result.message || "Upload failed");
    }
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result); // Base64 string of the image
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className=" flex flex-col gap-4 max-w-md w-full">
      <Label>Upload File (Image/PDF only)</Label>
      {/* File Input */}
      {file && (
        <img src={preview} alt="Preview" className="h-10 w-20 object-cover" />
      )}

      <Input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg*"
        onChange={(e) => e.target.files && setFile(e.target.files[0])}
      />

      {/* Date Picker */}
      <Label>Document Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Major Head */}

      <Label>Category</Label>

      <Select
        value={majorHead}
        onValueChange={setMajorHead}
        className="bg-white"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {/* <SelectLabel>category</SelectLabel> */}
            <SelectItem value="Personal">Personal</SelectItem>
            <SelectItem value="Professional">Professional</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Minor Head */}

      <Label>Sub Category</Label>
      <Select value={minorHead} onValueChange={setMinorHead}>
        <SelectTrigger>
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          {(majorHead === "Personal" ? NAMES : DEPARTMENTS).map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Tags */}

      <Label>Tags</Label>
      <div className="flex gap-2 mb-2">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Type tag..."
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), handleAddTag())
          }
        />
        <Button type="button" onClick={handleAddTag}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <Badge
            key={t}
            variant="secondary"
            className="flex items-center gap-1 cursor-pointer"
          >
            {t}
            <span
              onClick={() => {
                handleRemoveTag(t);
              }}
            >
              <X size={14} className="cursor-pointer" />
            </span>
          </Badge>
        ))}
      </div>

      {/* Remarks */}

      <Label>Remarks</Label>
      <Input
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        placeholder="Enter remarks"
      />

      {/* Submit */}
      <Button onClick={handleSubmit}>Upload Document</Button>
    </div>
  );
}

export default UploadFile;
