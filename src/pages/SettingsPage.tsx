import LinkBtn from "../components/LinkBtn";

const SettingsPage: React.FC = () => {
  return (
    <div>
      <h1>settings</h1>
      <LinkBtn destination="/user" destinationName="Back to main page" />
    </div>
  );
};

export default SettingsPage;
