import UserMenu from "@/components/navbar-components/user-menu";

export default function NavbarDashboard({ pagename }: { pagename: string }) {
    return (
        <>
            <div className="w-full">
                <div className="flex w-full h-16 items-center justify-between gap-4 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <h1 className="font-semibold">{pagename}</h1>
                    <UserMenu isVisible={true} />
                </div>
            </div>
        </>
    )
}