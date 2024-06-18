import { useContext } from "react";
import userContext from "../../../../Context/auth/userContext";

const AccountPrivacy = () => {
  const { changeAccountType, accountType } = useContext(userContext);
  return (
    <div className="flex w-full items-center justify-center p-3">
      <div className="w-full md:w-[50%]">
        <span className="text-xl font-bold">Account Privacy</span>
        <div className="relative mt-3 flex ">
          <span>Private Account</span>
          <div className="absolute right-5">
            <div className="inline-flex items-center">
              <div className="relative inline-block h-4 w-8 cursor-pointer rounded-full">
                <input
                  onChange={changeAccountType}
                  checked={accountType === "private"}
                  id="switch-component"
                  type="checkbox"
                  className="peer absolute h-4 w-8 cursor-pointer appearance-none rounded-full bg-gray-300 transition-colors duration-300 checked:bg-gray-900 peer-checked:border-gray-900 peer-checked:before:bg-gray-900"
                />
                <label
                  htmlFor="switch-component"
                  className="before:content[''] border-blue-gray-100 before:bg-blue-gray-500 absolute -left-1 top-2/4 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border bg-white shadow-md transition-all duration-300 before:absolute before:left-2/4 before:top-2/4 before:block before:h-10 before:w-10 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-gray-900 peer-checked:before:bg-gray-900"
                >
                  <div
                    className="left-2/4 top-2/4 inline-block -translate-x-2/4 -translate-y-2/4 rounded-full p-5"
                    data-ripple-dark="true"
                  ></div>
                </label>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm  text-gray-500">
          When your account is public, your profile and posts can be seen by
          anyone.
        </p>
        <p className="mt-3 text-sm  text-gray-500">
          When your account is private, only the followers you approve can see
          what you share, including your photos.
        </p>
      </div>
    </div>
  );
};

export default AccountPrivacy;
