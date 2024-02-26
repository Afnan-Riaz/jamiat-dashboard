
export default function HomepageLayout({
    children,
    analytics,
    footprints,
    banner
  }: {
    children: React.ReactNode,
    analytics: React.ReactNode
    footprints: React.ReactNode
    banner: React.ReactNode
  }) {
    return (
      <>
        <div style={{marginBottom:"20px"}}>{children}</div>
        <div style={{marginBottom:"20px"}}>{analytics}</div>
        <div style={{marginBottom:"20px"}}>{footprints}</div>
        <div style={{marginBottom:"20px"}}>{banner}</div>
      </>
    );
  }