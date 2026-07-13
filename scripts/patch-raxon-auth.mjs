/**
 * Re-applies checkout auth UX patches to @raxonltd/raxon-core after install.
 * Keeps register → auto-login behavior durable across npm/bun installs.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const target = path.join(
  process.cwd(),
  "node_modules/@raxonltd/raxon-core/dist/core/feature/auth/view/view.register.js",
);

if (!existsSync(target)) {
  console.warn("[patch-raxon-auth] view.register.js not found, skipping");
  process.exit(0);
}

let source = readFileSync(target, "utf8");

if (source.includes("Kayıt tamamlandı, devam edebilirsiniz")) {
  console.log("[patch-raxon-auth] already patched");
  process.exit(0);
}

if (!source.includes("const { register: authRegister } = useAuth();")) {
  console.warn("[patch-raxon-auth] unexpected ViewRegister shape, skipping");
  process.exit(0);
}

source = source.replace(
  "const { register: authRegister } = useAuth();\n    const registerMutation = authRegister();",
  "const { register: authRegister, loginEmail } = useAuth();\n    const registerMutation = authRegister();\n    const loginMutation = loginEmail();",
);

source = source.replace(
  `onSuccess: () => {
                onSwitchToLogin?.();
            },`,
  `onSuccess: () => {
                loginMutation.mutate({ email: data.email, password: data.password }, {
                    onSuccess: () => {
                        toast.success('Kayıt tamamlandı, devam edebilirsiniz');
                        onClose?.();
                    },
                    onError: () => {
                        toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
                        onSwitchToLogin?.();
                    }
                });
            },`,
);

writeFileSync(target, source);
console.log("[patch-raxon-auth] patched ViewRegister auto-login");
