import './globals.css'; import { AppHeader } from '@/components/app-header'; import { PageMotion } from '@/components/page-motion';
export const metadata={title:'BountyQ — Human judgment for agents',description:'A fast human-answer layer for autonomous agents.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><AppHeader/><main><PageMotion>{children}</PageMotion></main></body></html>}
