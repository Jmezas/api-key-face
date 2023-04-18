$EC2_ADDRESS = "54.89.70.110"

# 1. Build your project
npm run build

 # 2. Zip the bundled files, env, package.json
7z a bundle.zip dist package.json .env

# 3. Clean the app folder
ssh ubuntu@$EC2_ADDRESS "cd /home/ubuntu/app && rm -rf *"

# 4. Copy the zip file to the EC2 instance
$target = "ubuntu@$EC2_ADDRESS" + ":/home/ubuntu/app/bundle.zip"
scp .\bundle.zip $target

# 5. Unzip the file
ssh ubuntu@$EC2_ADDRESS "cd /home/ubuntu/app && unzip -o bundle.zip"

# 6. Install the dependencies
ssh ubuntu@$EC2_ADDRESS 'cd /home/ubuntu/app && export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v16.20.0/bin && npm install'

# 7. Restart the pm2 process
ssh ubuntu@$EC2_ADDRESS 'cd /home/ubuntu/app && export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v16.20.0/bin && pm2 restart all'

# 8. Remove the zip file
ssh ubuntu@$EC2_ADDRESS "cd /home/ubuntu/app && rm bundle.zip"
Remove-Item bundle.zip