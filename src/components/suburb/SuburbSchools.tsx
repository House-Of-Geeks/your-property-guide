import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui";
import type { School } from "@/types";

interface SuburbSchoolsProps {
  schools: School[];
}

export function SuburbSchools({ schools }: SuburbSchoolsProps) {
  if (schools.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-primary" />
        Nearby Schools
      </h2>
      <div className="space-y-3">
        {schools.map((school) => (
          <div
            key={school.name}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white"
          >
            <div>
              <p className="font-medium text-gray-900">{school.name}</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">{school.type}</Badge>
                <Badge variant={school.sector === "government" ? "default" : "primary"}>
                  {school.sector}
                </Badge>
              </div>
            </div>
            <span className="text-sm text-gray-500">{school.distance}km</span>
          </div>
        ))}
      </div>
    </div>
  );
}
