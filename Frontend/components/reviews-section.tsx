"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const REVIEWS = [
  {
    id: 1,
    author: "Carlos M.",
    rating: 5,
    date: "hace 2 días",
    title: "Excelente dispositivo",
    comment:
      "El mejor iPhone que he tenido. La cámara es increíble y la batería dura todo el día con uso intenso. Altamente recomendado.",
    helpful: 245,
  },
  {
    id: 2,
    author: "María L.",
    rating: 4,
    date: "hace 1 semana",
    title: "Muy bueno, pero caro",
    comment:
      "Funciona perfectamente, pero es bastante caro. Vale la pena si tienes presupuesto, pero considera otras opciones si buscas algo más económico.",
    helpful: 123,
  },
  {
    id: 3,
    author: "Juan P.",
    rating: 5,
    date: "hace 2 semanas",
    title: "Compra segura",
    comment:
      "La entrega fue rápida y el producto llegó en perfecto estado. El servicio al cliente fue excelente. Volveré a comprar aquí.",
    helpful: 456,
  },
]

interface ReviewsSectionProps {
  productId: string
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [newReview, setNewReview] = useState("")
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")

  const handleSubmitReview = () => {
    console.log("Review submitted:", { rating, title, comment: newReview })
    setNewReview("")
    setRating(5)
    setTitle("")
  }

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Reseñas y comentarios</h2>

      {/* New Review Form */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Deja tu reseña</h3>

        <div className="space-y-4">
          {/* Rating */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Calificación</label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setRating(i + 1)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${i < rating ? "fill-accent text-accent" : "text-border hover:text-accent"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Título de tu reseña</label>
            <input
              type="text"
              placeholder="Resumen de tu experiencia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Tu comentario</label>
            <Textarea
              placeholder="Comparte tu opinión sobre este producto..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="min-h-32 rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <Button onClick={handleSubmitReview} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Publicar reseña
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Comentarios de usuarios</h3>

        {REVIEWS.map((review) => (
          <div key={review.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground">{review.author}</p>
                <p className="text-sm text-muted-foreground">{review.date}</p>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? "fill-accent text-accent" : "text-border"}`}
                  />
                ))}
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
            <p className="text-muted-foreground mb-4 leading-relaxed">{review.comment}</p>

            <div className="flex items-center gap-4">
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                👍 Útil ({review.helpful})
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                👎 No útil
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
