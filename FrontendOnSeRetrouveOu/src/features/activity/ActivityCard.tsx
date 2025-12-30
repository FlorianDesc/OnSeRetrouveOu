import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Activity } from "@/types/activity";
import { Calendar, MapPin, User, Users } from "lucide-react";
import { activityImages } from "./constants/activityImages";

type ActivityCardProps = {
  activity: Activity;
};

export default function ActivityCard({ activity }: ActivityCardProps) {
  const formattedDate = new Date(activity.dateActivity).toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const activityImage = activityImages[activity.id];

  return (
    <Card className="w-full overflow-hidden p-0">
      <div className="flex flex-row h-full">
        {activityImage && (
          <div className="w-[35%]">
            <img
              src={activityImage}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-col w-[65%] py-6">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl font-semibold">
              {activity.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0 pt-0">
            <p className="text-sm text-gray-600 mb-3">{activity.description}</p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{activity.location}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>
                  Créé par {activity.creator.firstname}{" "}
                  {activity.creator.lastname}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{activity.maxParticipants} participants</span>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
