import {fonts} from "@/app/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className={fonts.rubik.variable}
            suppressHydrationWarning={true}
        >
        <body suppressHydrationWarning={true}>{children}</body>
        </html>
    )
}