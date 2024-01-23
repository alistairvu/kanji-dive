import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function SearchBox({
  defaultValue,
  disabled,
}: {
  defaultValue?: string;
  disabled?: boolean;
}) {
  return (
    <form className="flex gap-2">
      <Input
        className="border-gray-300"
        placeholder="Search..."
        name="query"
        defaultValue={defaultValue}
        disabled={disabled}
      />
      <Button disabled={disabled}>
        <SearchIcon className="mr-2 h-4 w-4" /> Search
      </Button>
    </form>
  );
}
