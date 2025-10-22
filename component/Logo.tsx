import Image from "next/image"

interface LogoProps {
  size?: "small" | "medium" | "large"
  className?: string
}

export function Logo({ size = "large", className = "" }: LogoProps) {
  const sizes = {
    small: { width: 40, height: 40 },
    medium: { width: 80, height: 80 },
    large: { width: 200, height: 200 },
  }

  const selectedSize = sizes[size]

  return (
    <div className={`flex flex-col items-center ${size === "large" ? "mb-8" : ""} ${className}`}>
      <Image
        src="/logo.png"
        alt="Comercial Ribeiro"
        width={selectedSize.width}
        height={selectedSize.height}
        className={size === "large" ? "mb-4" : ""}
      />
    </div>
  )
}
