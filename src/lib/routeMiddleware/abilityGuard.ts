import { UserService } from "@services/server/users/UserService";
import { serverContainer } from "@services/serverContainer";
import { GuardError } from "@/lib/util/fluentRouteBuilder";

export default function abilityGuard(task: string, module: any) {
  return async () => {
    const userService = serverContainer.get(UserService);
    const ability = await userService.getAbility();
    if (ability.cannot(task, module)) {
      throw new GuardError("Unauthorized");
    }
  };
}
