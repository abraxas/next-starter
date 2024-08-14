import { UserService } from "@services/server/users/User.Service";
import { serverContainer } from "@services/serverContainer";
import { GuardError } from "@/lib/types/errors";

export default function abilityGuard(task: string, module: any) {
  return async () => {
    const userService = serverContainer.get(UserService);
    const ability = await userService.getAbility();
    if (ability.cannot(task, module)) {
      throw new GuardError("Unauthorized");
    }
  };
}
