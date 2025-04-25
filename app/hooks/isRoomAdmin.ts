import { useEffect, useState } from "react";
import { stompApi } from "@/api/stompApi";

export function useIsRoomAdmin() {
  const [isAdmin, setIsAdmin] = useState(stompApi.isRoomAdmin());

  useEffect(() => {
    const update = () => setIsAdmin(stompApi.isRoomAdmin());
    stompApi.addAdminListener(update);

    update();

    return () => {
      stompApi.removeAdminListener(update);
    };
  }, []);

  return isAdmin;
}
