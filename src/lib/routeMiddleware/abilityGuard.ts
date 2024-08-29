import { userService } from "@services/server/users/User.service";
import { GuardError } from "@/lib/types/errors";

export default function abilityGuard(task: string, module: any) {
  return async () => {
    const ability = await userService.getAbility();
    if (ability.cannot(task, module)) {
      throw new GuardError("Unauthorized");
    }
  };
}
