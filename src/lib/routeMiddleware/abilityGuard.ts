import { UserService } from "@services/server/users/User.service";
import { inversifyServerContainer } from "@services/inversifyServerContainer";
import { GuardError } from "@/lib/types/errors";

export default function abilityGuard(task: string, module: any) {
  return async () => {
    const userService = inversifyServerContainer.get(UserService);
    const ability = await userService.getAbility();
    if (ability.cannot(task, module)) {
      throw new GuardError("Unauthorized");
    }
  };
}
