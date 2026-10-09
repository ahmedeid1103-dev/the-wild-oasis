import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default function Page() {
  return (
    <div>
      <h1 className="mb-3 text-4xl font-medium text-accent-400">
        Update your guest profile
      </h1>

      <p className="mb-10 max-w-2xl text-lg leading-8 text-primary-200">
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>

      <form className="max-w-2xl space-y-6">
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium text-primary-300"
          >
            Full name
          </label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            defaultValue="Jonas Schmedtmann"
            className="w-full border border-primary-700 bg-primary-900 px-5 py-3 text-primary-100 outline-none transition-colors focus:border-accent-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-primary-300"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            defaultValue="jonas@example.com"
            disabled
            className="w-full border border-primary-800 bg-primary-900 px-5 py-3 text-primary-500"
          />
        </div>

        <div>
          <label
            htmlFor="nationality"
            className="mb-2 block text-sm font-medium text-primary-300"
          >
            Nationality
          </label>

          <select
            id="nationality"
            name="nationality"
            defaultValue="Germany"
            className="w-full border border-primary-700 bg-primary-900 px-5 py-3 text-primary-100 outline-none transition-colors focus:border-accent-500"
          >
            <option value="Germany">Germany</option>
            <option value="Italy">Italy</option>
            <option value="France">France</option>
            <option value="Spain">Spain</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
            <option value="Egypt">Egypt</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="nationalId"
            className="mb-2 block text-sm font-medium text-primary-300"
          >
            National ID
          </label>

          <input
            id="nationalId"
            name="nationalId"
            type="text"
            defaultValue="DE123456789"
            className="w-full border border-primary-700 bg-primary-900 px-5 py-3 text-primary-100 outline-none transition-colors focus:border-accent-500"
          />
        </div>

        <button
          type="submit"
          className="bg-accent-500 px-6 py-3 font-semibold text-primary-900 transition-colors hover:bg-accent-600"
        >
          Update profile
        </button>
      </form>
    </div>
  );
}
