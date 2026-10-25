type ReservationSummaryProps = {
  reservations: {
    numNights: number;
    totalPrice: number;
  }[];
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function ReservationSummary({
  reservations,
}: ReservationSummaryProps) {
  const summary = reservations.reduce(
    (totals, reservation) => ({
      nights: totals.nights + reservation.numNights,
      totalValue: totals.totalValue + reservation.totalPrice,
    }),
    { nights: 0, totalValue: 0 },
  );

  const metrics = [
    { label: "Reservations", value: reservations.length },
    { label: "Nights booked", value: summary.nights },
    { label: "Total value", value: currencyFormatter.format(summary.totalValue) },
  ];

  return (
    <section
      aria-label="Reservation summary"
      className="mb-8 grid gap-4 sm:grid-cols-3"
    >
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className="ui-card ui-card--raised p-5 shadow-none"
        >
          <p className="mb-2 text-sm text-primary-400">{metric.label}</p>
          <p className="text-2xl font-medium text-primary-100">
            {metric.value}
          </p>
        </article>
      ))}
    </section>
  );
}
