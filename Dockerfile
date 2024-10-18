FROM node:14

# Create and set the working directory in the container
WORKDIR /usr/src/app

ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Clone the repository (replace with your repository URL)
#RUN git clone https://github.com/CheongbinKim/simplechat.git .
COPY simplechat .

# Install dependencies
RUN npm install

# Expose port 3000 (or whatever port your app uses)
EXPOSE 3000

# Run the application
CMD ["npm", "start"]

