'use client';

export default function SectionBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* faint scientific grid layered over the global cosmic field */}
      <div className="lab-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(120%_70%_at_50%_30%,#000_55%,transparent)]" />
      {/* a couple of soft, translucent nebula blooms for local depth */}
      <div className="absolute left-[-14rem] top-[12%] h-[28rem] w-[28rem] rounded-full bg-primary/[0.05] blur-[120px]" />
      <div className="absolute right-[-15rem] top-[40%] h-[34rem] w-[34rem] rounded-full bg-[#a78bfa]/[0.05] blur-[130px]" />
      <div className="absolute bottom-[6%] left-[20%] h-[30rem] w-[30rem] rounded-full bg-[#d6b56d]/[0.04] blur-[130px]" />
    </div>
  );
}
